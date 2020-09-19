import { Component } from 'react';
import isEqual from 'lodash.isequal';

import Checkbox from './Checkbox';
import Group from './Group';

import styles from './index.less';

class CheckAll extends Component {
  constructor(props) {
    super(props);
    this._plainGroups = this.groupsFormat();
    this.state = {
      checkAll: props.checked,
      checkedList: props.checked ? this._plainGroups : {},
      ha:121,
      ha2:2,
    };
    this._trigger = props.groups.reduce((prev, next) => prev + next.options.length, 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.checked !== this.props.checked ||
      nextState.checkAll !== this.state.checkAll ||
      !isEqual(nextState.checkedList, this.state.checkedList)
    );
  }

  groupsFormat = () => {
    const result = {};

    this.props.groups.forEach(({ title, options }) => {
      result[title] = options;
    });

    return result;
  };

  onCheckAllChange = ({ target: { checked } }) => {
    this.setState({
      checkAll: checked,
      checkedList: checked ? this._plainGroups : {}
    });
  }

  onChange = (title, values) => {
    this.setState(prevState => {
      const prevCheckedList = { ...prevState.checkedList };

      prevCheckedList[title] = values;

      return {
        checkAll: Object.values(prevCheckedList).reduce((prev, next) => prev + next.length, 0) === this._trigger,
        checkedList: prevCheckedList
      };
    });
  };

  render() {
    const { groups } = this.props;
    const { checkAll, checkedList } = this.state;

    return (
      <div className={styles.checkAll}>
        <Checkbox checked={checkAll} onChange={this.onCheckAllChange}>Check All</Checkbox>
        <div className={styles.groups}>
          {groups.map(({ title, options }, index) => (
            <Group
              key={index}
              title={title}
              options={options}
              value={checkedList[title] || []}
              onChange={values => this.onChange(title, values)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CheckAll;
