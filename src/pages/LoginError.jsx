import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginError.module.css';
import errorImage from '../assets/pingLol.png';

function LoginError() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (secondsLeft === 0) {
      navigate('/');
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [secondsLeft, navigate]);

  return (
    <div className={styles.container}>
      <img src={errorImage} alt="Error de cuenta" className={styles.errorImage} />
      <h2 className={styles.errorText}>Error: Cuenta registrada con otro proveedor</h2>
      <p className={styles.infoText}>
        Serás redirigido al inicio en {secondsLeft} segundo{secondsLeft !== 1 ? 's' : ''}...
      </p>
    </div>
  );
}

export default LoginError;
