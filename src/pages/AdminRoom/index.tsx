import { useHistory, useParams } from "react-router-dom"
import logoImg from '../../assets/images/logo.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import { Button } from '../../components/Button';
import { Question } from "../../components/Question";
import { RoomCode } from '../../components/RoomCode';
import { useRoom } from "../../hooks/useRoom";
import { database } from "../../services/firebase";
import { PageRoom } from '../../styles/room';
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { theme } = useContext(ThemeContext)
  const history = useHistory();
  const { id } = useParams<RoomParams>();
  const { title, questions } = useRoom(id)

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que você deseja encerrar está sala?')) {
      await database.ref(`rooms/${id}`).update({
        endAt: new Date(),
      });
      history.push('/')
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${id}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${id}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${id}/questions/${questionId}`).remove();
    }
  }

 return (
   <PageRoom>
     <header>
      <div className="content">
        <img src={theme.title === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
        <div>
          <RoomCode code={id}/>
          <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
        </div>
      </div>
     </header>
     <main className="content">
      <div className="room-title">
        <h1>{title}</h1>
        {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
      </div>

      {questions.map(question => {
        return (
          <Question
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
          >
            { !question.isAnswered ? (
              <>
                <button
                  className="like-button"
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="highlight mensagem" />
                </button>
                <button
                  className="like-button"
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img src={answerImg} alt="responder mensagem" />
                </button>
              </>
            ) : null}
            <button
              className="like-button"
              type="button"
              aria-label="Marcar como gostei"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <img src={deleteImg} alt="deletar mensagem" />
            </button>
          </Question>
        )
      })}
     </main>
   </PageRoom>
 )
}