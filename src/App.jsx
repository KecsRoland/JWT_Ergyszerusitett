import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('zoli01');
  const [password, setPassword] = useState('Alma123@');
  const [token, setToken] = useState('');
  const [feedback, setFeedback] = useState('');

  const API_BASE_URL = 'http://localhost:5035';

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

  const handleProtectedRequest = async () => {
    setFeedback('Adat lekérdezése...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/protected`, {
        method: 'GET',
        headers: {
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4f8', padding: '20px' }}>
      <div style={{ padding: '40px 30px', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', maxWidth: '380px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)' }}>
        <h2 style={{ margin: '0 0 25px 0', color: '#2d3748', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>JWT Bejelentkezés</h2>
        
        <div style={{ minHeight: '44px', marginBottom: '25px' }}>
          {feedback && (
            <p style={{ fontWeight: '600', fontSize: '14px', margin: 0, color: feedback.includes('❌') ? '#e53e3e' : '#38a169', padding: '12px', backgroundColor: feedback.includes('❌') ? '#fff5f5' : '#f0fff4', borderRadius: '8px', border: `1px solid ${feedback.includes('❌') ? '#fed7d7' : '#c6f6d5'}` }}>
              {feedback}
            </p>
          )}
        </div>

        {!token ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Felhasználónév" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f7fafc', color: '#4a5568', transition: 'border-color 0.2s' }}
            />
            <input 
              type="password" 
              placeholder="Jelszó" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f7fafc', color: '#4a5568', transition: 'border-color 0.2s' }}
            />
            <button type="submit" style={{ padding: '14px', cursor: 'pointer', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginTop: '4px', boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)' }}>
              Bejelentkezés
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: '#edf2f7', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'left' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold', color: '#718096' }}>Kapott token</p>
              <p style={{ fontSize: '12px', color: '#4a5568', wordBreak: 'break-all', margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', lineHeight: '1.5' }}>
                {token}
              </p>
            </div>
            
            <button onClick={handleProtectedRequest} style={{ padding: '14px', cursor: 'pointer', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(56, 161, 105, 0.2)' }}>
              Védett adat lekérdezése
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;