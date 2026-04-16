import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('zoli01');
  const [password, setPassword] = useState('Alma123@');
  const [token, setToken] = useState('');
  const [feedback, setFeedback] = useState('');

  // A te saját, helyi backended címe a portszámmal, amit a képen láttunk
  const API_BASE_URL = 'http://localhost:5035';

  // --- 1. Lépés: Bejelentkezés ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback('Bejelentkezés folyamatban...');

    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const kapottToken = await response.text();
        setToken(kapottToken);
        setFeedback('✅ Sikeres bejelentkezés! Token elmentve.');
      } else {
        setFeedback('❌ Hibás felhasználónév vagy jelszó!');
      }
    } catch (hiba) {
      setFeedback('❌ Hiba történt. Biztosan fut a backend (a fekete ablak)?');
      console.error(hiba);
    }
  };

  // --- 2. Lépés: Védett végpont lekérdezése ---
  const handleProtectedRequest = async () => {
    setFeedback('Adat lekérdezése...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/protected`, {
        method: 'GET',
        headers: {
          // Itt küldjük be a hitelesítő tokent a kérés fejlécében (Header)
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        const adat = await response.text();
        setFeedback(`🔒 Védett válasz: ${adat}`);
      } else {
        setFeedback('❌ Nincs jogosultságod! (Vagy lejárt a token)');
      }
    } catch (hiba) {
      setFeedback('❌ Hiba történt a kérés során.');
      console.error(hiba);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '400px', margin: '40px auto', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>JWT Bejelentkezés</h2>
      
      {/* Visszajelző üzenetek (sikeres/hibás) */}
      <p style={{ fontWeight: '500', minHeight: '20px', color: feedback.includes('❌') ? '#d9534f' : '#28a745', marginBottom: '20px' }}>
        {feedback}
      </p>

      {/* Ha MÉG NINCS tokenünk, a bejelentkezési formot mutatjuk */}
      {!token ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Felhasználónév" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
          />
          <input 
            type="password" 
            placeholder="Jelszó" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold' }}>
            Bejelentkezés
          </button>
        </form>
      ) : (
        /* Ha MÁR VAN tokenünk, a védett végpont gombját mutatjuk */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: '#495057' }}>Kapott token:</p>
            <p style={{ fontSize: '11px', color: '#6c757d', wordBreak: 'break-all', margin: 0, fontFamily: 'monospace' }}>
              {token}
            </p>
          </div>
          
          <button onClick={handleProtectedRequest} style={{ padding: '12px', cursor: 'pointer', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold' }}>
            Védett adat lekérdezése (GET)
          </button>
        </div>
      )}
    </div>
  );
}

export default App;