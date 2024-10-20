import React from "react";
import { useNavigate } from "react-router-dom";

const AdminModal = ({ onClose }) => {
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "Omariscool1234!") {
      onClose();
      navigate("/admin");
    } else {
      alert("Incorrect password");
    }
  };

  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "2em",
      borderRadius: "8px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "0.5em",
      marginBottom: "1em",
      fontSize: "1em",
    },
    button: {
      padding: "0.5em 1em",
      fontSize: "1em",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Enter Admin Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
