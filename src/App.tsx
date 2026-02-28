import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState<number>(0); 
  const max = 10; 
  const min = 0;  

  function incrementar() {
    if (count < max) {
      setCount(count + 1);
    }
  }

  
  function decrementar() {
    if (count > min) {
      setCount(count - 1);
    }
  }

  
  function resetear() {
    setCount(0);
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Contador 🚀</h1>
      <h2>{count}</h2>

      <button onClick={incrementar} style={{ marginRight: '5px' }}>
        Incrementar ➕
      </button>

      <button onClick={decrementar} style={{ marginRight: '5px' }}>
        Decrementar ➖
      </button>

      <button onClick={resetear}>
        Reset 🔄
      </button>

      {}
      {count >= max && <p style={{ color: 'red' }}>¡Has llegado al máximo!</p>}
      {count <= min && <p style={{ color: 'blue' }}>¡Has llegado al mínimo!</p>}
    </div>
  );
}