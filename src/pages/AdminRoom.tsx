import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Modal from 'react-modal';

import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';
import checkImg from '../assets/check.svg';
import answerImg from '../assets/answer.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';



type RoomParams = {
    id: string;
}



export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [isModalVisible, setIsModalVisible] = useState<string | undefined>();
    const [isModal2Visible, setIsModal2Visible] = useState(false);

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

    async function handleDeleteQuestionConfirm(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        setIsModalVisible(undefined)
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswer: true
        })
    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id} />
                        <Button isOutlined onClick={() => { setIsModal2Visible(true) }}>Encerrar Sala</Button>
                        <Modal
                            isOpen={isModal2Visible}
                            onRequestClose={() => setIsModal2Visible(false)}
                            className="modal"
                            overlayClassName="modal-overlay"
                        >
                            <p>Encerrar sala</p>
                            <span>Tem certeza que você deseja encerrar esta sala?</span>
                            <div>
                                <Button onClick={() => setIsModal2Visible(false)}>Cancelar</Button>
                                <Button isOutlined onClick={handleEndRoom}>Sim, encerrar</Button>
                            </div>
                        </Modal>
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
                                isAnswer={question.isAnswer}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswer && (
                                    <>
                                        <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button type="button" onClick={() => handleHighLightQuestion(question.id)}>
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>
                                )}
                                <button type="button" onClick={() => setIsModalVisible(question.id)}>
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                                <Modal
                                    isOpen={isModalVisible == question.id}
                                    onRequestClose={() => setIsModalVisible(undefined)}
                                    className="modal"
                                    overlayClassName="modal-overlay"
                                >
                                    <p>Excluir pergunta</p>
                                    <span>Tem certeza que você deseja excluir esta pergunta??</span>
                                    <div>
                                        <Button onClick={() => setIsModalVisible(undefined)}>Cancelar</Button>
                                        <Button isOutlined onClick={() => { handleDeleteQuestionConfirm(question.id) }}>Sim, excluir</Button>
                                    </div>
                                </Modal>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}