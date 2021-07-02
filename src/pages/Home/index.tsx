import { FormEvent, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/Button';
import Switch from 'react-switch';
import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';
import googleIconImg from '../../assets/images/google-icon.svg';

import { PageAuth } from '../../styles/auth';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import { ThemeContext } from '../../contexts/ThemeContext';
import { shade } from 'polished';

export function Home() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <PageAuth>
      <aside>
          <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
          <strong>Crie salas Q&amp;A ao-vivo</strong>
          <p>Tire as dúvidas da sua audiência em tempo-real</p>
          <Switch 
            onChange={toggleTheme}
            checked={theme.title === 'dark'}
            checkedIcon={false}
            uncheckedIcon={false}
            height={10}
            width={40}
            handleDiameter={20}
            offColor={shade(0.15, theme.colors.primary)}
            onColor={theme.colors.secundary}
          />
      </aside>
      <main>
        <div className="main-content">
          <img src={theme.title === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o google
          </button>
          <div className="separetor">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </PageAuth>
  )
}