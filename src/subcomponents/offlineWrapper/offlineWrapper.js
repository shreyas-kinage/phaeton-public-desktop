import React from 'react';
import styles from './offlineWrapper.css';

const OfflineWrapper = props => (
  <div className={`${!props.offline ? '' : styles.isOffline}`}>
    {props.children}
  </div>
);

export default OfflineWrapper;
