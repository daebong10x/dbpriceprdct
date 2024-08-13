import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const Card = () => {
    return (
      <div className={styles.container}>
        <MdSupervisedUserCircle size={24} />
        <div className={styles.texts}>
          <span className={styles.title}>이번주 복숭아 평균가</span>
          <span className={styles.number}>10,273원</span>
          <span className={styles.detail}>
            <span className={styles.positive}>12% 상승</span> 지난주 평균가 10,000원</span>
        </div>
      </div>
    );
  };

export default Card