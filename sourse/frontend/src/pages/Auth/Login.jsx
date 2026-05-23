import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { login } = useAuth();
  const submit = e => { e.preventDefault(); login(email, pass).catch(() => alert('Ошибка входа')); };
  return (
    <form onSubmit={submit} style={{maxWidth:300, margin:'50px auto'}}>
      <h2>Вход</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={{display:'block', width:'100%', marginBottom:10}} />
      <input type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} required style={{display:'block', width:'100%', marginBottom:10}} />
      <button type="submit" style={{width:'100%'}}>Войти</button>
    </form>
  );
}