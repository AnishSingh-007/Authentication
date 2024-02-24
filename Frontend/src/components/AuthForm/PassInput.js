import React from "react";

export const PassInput = ({ title, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`${styles.input} `}>
      <input
        id="password"
        className={styles.passInput}
        // type="password"
        type={visible ? "text" : "password"}
        placeholder="Password"
        name="password"
        required
      />
      <span onClick={() => setVisible(!visible)}>
        {visible ? <FaEye /> : <FaEyeSlash />}
      </span>
    </div>

    //     <section className="panel">
    //     <h3>{title}</h3>
    //     {isActive ? (
    //       <p>{children}</p>
    //     ) : (
    //       <button onClick={() => setIsActive(true)}>
    //         Show
    //       </button>
    //     )}
    //   </section>
  );
};
