
import styles from "./card2.module.css";

const Card = () => {
    return (
        <div className={styles.texts}>
          <span className={styles.title}>대봉 로고</span>
          <span className={styles.number}>농산물 가격 예측모델</span>
          <span className={styles.number}>복숭아v 품목v 선택</span>

        </div>
    );
  };

export default Card