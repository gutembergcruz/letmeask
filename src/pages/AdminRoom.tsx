// import { useState } from 'react';
import { useParams } from 'react-router';

import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
// import { database } from '../services/firebase';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';



type RoomParams = {
    id: string;
}



export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }
    
    // async function handleSendQuestion(event: FormEvent) {
    //     event.preventDefault()

    //     if (newQuestion.trim() === '') {
    //         return
    //     }
    //     if (!user) {
    //         throw new Error('Rou must be logged in')
    //     }
    //     const question = {
    //         content: newQuestion,
    //         author: {
    //             name: user.name,
    //             avatar: user.avatar,
    //         },
    //         isHighlighted: false,
    //         isAnswer: false
    //     };

    //     await database.ref(`rooms/${roomId}/questions`).push(question)

    //     setNewQuestion('');
    // }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                    <RoomCode code={params.id} />
                    <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>}
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                            key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}