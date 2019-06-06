<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace craft\db;

use craft\base\ClonefixTrait;
use craft\events\DefineBehaviorsEvent;
use craft\helpers\ArrayHelper;
use yii\base\Exception;
use yii\db\Connection as YiiConnection;
use yii\db\ExpressionInterface;

/**
 * Class Query
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class Query extends \yii\db\Query
{
    // Traits
    // =========================================================================

    use ClonefixTrait;

    // Constants
    // =========================================================================

    /**
     * @event \yii\base\Event The event that is triggered after the query's init cycle
     * @see init()
     */
    const EVENT_INIT = 'init';

    /**
     * @event DefineBehaviorsEvent The event that is triggered when defining the class behaviors
     * @see behaviors()
     */
    const EVENT_DEFINE_BEHAVIORS = 'defineBehaviors';

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        if ($this->hasEventHandlers(self::EVENT_INIT)) {
            $this->trigger(self::EVENT_INIT);
        }
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        // Fire a 'defineBehaviors' event
        $event = new DefineBehaviorsEvent();
        $this->trigger(self::EVENT_DEFINE_BEHAVIORS, $event);
        return $event->behaviors;
    }

    /**
     * Returns whether a given table has been joined in this query.
     *
     * @param string $table
     * @return bool
     */
    public function isJoined(string $table): bool
    {
        foreach ($this->join as $join) {
            if ($join[1] === $table || strpos($join[1], $table) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    public function select($columns, $option = null)
    {
        $this->select = $this->normalizeSelect($columns);
        $this->selectOption = $option;
        return $this;
    }

    /**
     * @inheritdoc
     */
    public function addSelect($columns)
    {
        if ($this->select === null) {
            return $this->select($columns);
        }
        if (!is_array($this->select)) {
            $this->select = $this->normalizeSelect($this->select);
        }
        $this->select = array_merge($this->select, $this->normalizeSelect($columns));
        return $this;
    }

    /**
     * Normalizes the SELECT columns passed to [[select()]] or [[addSelect()]]
     *
     * @param string|array|ExpressionInterface $columns
     * @return array
     */
    protected function normalizeSelect($columns): array
    {
        if ($columns instanceof ExpressionInterface) {
            $columns = [$columns];
        } else if (!is_array($columns)) {
            $columns = preg_split('/\s*,\s*/', trim($columns), -1, PREG_SPLIT_NO_EMPTY);
        }
        $select = [];
        foreach ($columns as $columnAlias => $columnDefinition) {
            if (is_string($columnAlias)) {
                $select[$columnAlias] = $columnDefinition;
            } else if (preg_match('/^\w+$/', $columnDefinition)) {
                $select[$columnDefinition] = $columnDefinition;
            } else {
                $select[] = $columnDefinition;
            }
        }
        return $select;
    }

    /**
     * @inheritdoc
     */
    public function where($condition, $params = [])
    {
        if (!$condition) {
            $condition = null;
        }

        return parent::where($condition, $params);
    }

    /**
     * @inheritdoc
     */
    public function andWhere($condition, $params = [])
    {
        if (!$condition) {
            return $this;
        }

        return parent::andWhere($condition, $params);
    }

    /**
     * @inheritdoc
     */
    public function orWhere($condition, $params = [])
    {
        if (!$condition) {
            return $this;
        }

        return parent::orWhere($condition, $params);
    }

    // Execution functions
    // -------------------------------------------------------------------------

    /**
     * Executes the query and returns the first two columns in the results as key/value pairs.
     *
     * @param YiiConnection|null $db The database connection used to execute the query.
     * If this parameter is not given, the `db` application component will be used.
     * @return array the query results. If the query results in nothing, an empty array will be returned.
     * @throws Exception if less than two columns were selected
     */
    public function pairs(YiiConnection $db = null): array
    {
        try {
            $rows = $this->createCommand($db)->queryAll();
        } catch (QueryAbortedException $e) {
            return [];
        }

        if (!empty($rows)) {
            $columns = array_keys($rows[0]);

            if (count($columns) < 2) {
                throw new Exception('Less than two columns were selected');
            }

            $rows = ArrayHelper::map($rows, $columns[0], $columns[1]);
        }

        return $rows;
    }

    /**
     * @inheritdoc
     */
    public function all($db = null)
    {
        try {
            return parent::all($db);
        } catch (QueryAbortedException $e) {
            return [];
        }
    }

    /**
     * @inheritdoc
     * @return array|null the first row (in terms of an array) of the query result. Null is returned if the query
     * results in nothing.
     */
    public function one($db = null)
    {
        $limit = $this->limit;
        $this->limit = 1;
        try {
            $result = parent::one($db);
            // Be more like Yii 2.1
            if ($result === false) {
                $result = null;
            }
        } catch (QueryAbortedException $e) {
            $result = null;
        }
        $this->limit = $limit;
        return $result;
    }

    /**
     * @inheritdoc
     */
    public function scalar($db = null)
    {
        $limit = $this->limit;
        $this->limit = 1;
        try {
            $result = parent::scalar($db);
        } catch (QueryAbortedException $e) {
            $result = false;
        }
        $this->limit = $limit;
        return $result;
    }

    /**
     * @inheritdoc
     */
    public function column($db = null)
    {
        try {
            return parent::column($db);
        } catch (QueryAbortedException $e) {
            return [];
        }
    }

    /**
     * @inheritdoc
     */
    public function exists($db = null)
    {
        try {
            return parent::exists($db);
        } catch (QueryAbortedException $e) {
            return false;
        }
    }

    /**
     * Executes the query and returns a single row of result at a given offset.
     *
     * @param int $n The offset of the row to return. If [[offset]] is set, $offset will be added to it.
     * @param YiiConnection|null $db The database connection used to generate the SQL statement.
     * If this parameter is not given, the `db` application component will be used.
     * @return array|null The row (in terms of an array) of the query result. Null is returned if the query
     * results in nothing.
     */
    public function nth(int $n, YiiConnection $db = null)
    {
        $offset = $this->offset;
        $this->offset = ($offset ?: 0) + $n;
        $result = $this->one($db);
        $this->offset = $offset;

        return $result;
    }

    /**
     * Shortcut for `createCommand()->getRawSql()`.
     *
     * @param YiiConnection|null $db the database connection used to generate the SQL statement.
     * If this parameter is not given, the `db` application component will be used.
     * @return string
     * @see createCommand()
     * @see \yii\db\Command::getRawSql()
     */
    public function getRawSql(YiiConnection $db = null): string
    {
        return $this->createCommand($db)->getRawSql();
    }

    /**
     * @inheritdoc
     */
    protected function queryScalar($selectExpression, $db)
    {
        try {
            return parent::queryScalar($selectExpression, $db);
        } catch (QueryAbortedException $e) {
            return false;
        }
    }
}
