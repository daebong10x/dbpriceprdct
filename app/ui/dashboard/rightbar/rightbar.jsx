import Image from "next/image";
import styles from "./rightbar.module.css";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.bgContainer}>
          <Image className={styles.bg} src="/astronaut.png" alt="" fill />
        </div>
        <div className={styles.text}>
          <span className={styles.notification}>🔥 예측데이터활용법</span>
          <h3 className={styles.title}>
            대봉 예측 데이터를 활용하여 판매에 날개를 달아보세요.
          </h3>
          <span className={styles.subtitle}>설명</span>
          <p className={styles.desc}>
          설명
          </p>
          <button className={styles.button}>
            <MdPlayCircleFilled />
            Watch
          </button>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>🚀 대봉 상품 구매하기</span>
          <h3 className={styles.title}>
            설명
          </h3>
          <span className={styles.subtitle}>HI</span>
          <p className={styles.desc}>
            설명
          </p>
          <button className={styles.button}>
            <MdReadMore />
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
