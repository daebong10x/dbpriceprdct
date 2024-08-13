import styles from "../ui/dashboard/dashboard.module.css";
import Footer from "../ui/dashboard/footer/footer"

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {children}
        <Footer/>
      </div>
    </div>
  );
};

export default Layout;