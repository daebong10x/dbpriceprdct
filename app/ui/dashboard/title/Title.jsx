import React from 'react';
import styles from './Title.module.css'; // CSS 모듈 임포트

const Title = () => {
  return (
    <div className={styles.titleContainer}>
      <h1 className={styles.titleText}>대봉 가격 예측 프로그램</h1>
      <h3 className={styles.subtitle}>다음주 전국 과일 도매가격을 미리 확인하세요.</h3>
    </div>
  );
};

export default Title;
