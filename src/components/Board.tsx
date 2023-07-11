import { Droppable, Draggable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import React from "react";

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  border-radius: 0.25rem;
  color: ${(props) => props.theme.boardIconColor};
  .card-icon {
    cursor: pointer;
    border-radius: 0.25rem;
    padding: 0.4rem;
    opacity: 0;
  }
  .card-icon:hover {
    background-color: ${(props) => props.theme.boardIconHoverColor};
    transition: background-color 0.2s ease;
  }
  .card-icon:active {
    background-color: ${(props) => props.theme.boardIconActiveColor};
  }
`;

const Wrapper = styled.div`
  width: 18.75rem;
  min-width: 18.75rem;
  background-color: ${(props) => props.theme.boardColor};
  transition: background-color 0.2s ease-in;
  border-radius: 0.5rem;
  height: max-content;
  max-height: calc(100vh - 11.85rem);
  margin: 0rem 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0rem 0.3rem 0.5rem rgba(50, 50, 50, 0.1),
              0rem 0.3rem 0.5rem rgba(50, 50, 50, 0.1);
  &:hover ${IconContainer} .card-icon {
    opacity: 1;
    transition: opacity 0.2s ease 0.1s;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  h2 {
    font-weight: 700;
    font-size: 1.3rem;
    white-space: nowrap;
  }
  span {
    padding: 0rem 0.8rem;
    color: #a0a0a0;
    font-size: 0.9rem;
  }
`;

interface IAreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${props => 
    props.isDraggingOver ? "#fadb8e" : props.draggingFromThisWith ? "#E0DBCD" : "transparent"};
  transition: background-color .3s ease-in-out;
  padding: 0.3rem 1rem;
  overflow: hidden auto;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
    border: none;
    padding: 1rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    background-color: #fadb8e;
  }
`;

interface IBoardProps {
    index: number;
    boardId: number;
    boardName: string;
    toDos: ITodo[];
}

interface IForm {
  toDo: string;
}

function Board({ index, toDos, boardId, boardName }: IBoardProps)  {
  const setBoards = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValue = ({toDo}:IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setBoards((allBoards) => {
      const allBoardsCopy = [...allBoards];
      const boardIndex = allBoardsCopy.findIndex(board => board.id === boardId);
      const targetBoardCopy = {...allBoardsCopy[boardIndex]};
      // 기존 요소에 새로운 newToDo 추가
      targetBoardCopy.toDos = [...targetBoardCopy.toDos, newToDo];
      // 해당 board index 자리에 이전 object는 삭제하고 바꾼 board object로 추가
      allBoardsCopy.splice(boardIndex, 1, targetBoardCopy);
      return allBoardsCopy;
    });
    setValue("toDo", "");
  };
  const onDeleteBoard = () => {
    if(window.confirm(`${boardName}를(을) 삭제하시겠습니까? 이 보드 안의 모든 작업 목록이 삭제됩니다.`)) {
      setBoards((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const boardIndex = allBoardsCopy.findIndex(board => board.id === boardId);
        allBoardsCopy.splice(boardIndex, 1);
        return allBoardsCopy;
      })
    }
  };
  return (
    <Draggable draggableId={boardId+""} index={index}>
      {(provided) => (        
        <Wrapper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <TitleContainer>
            <Title>
              <h2>{boardName}</h2>
              <span>{toDos.length}</span>
            </Title>
            <IconContainer>
              <FontAwesomeIcon className="card-icon" type="button" icon={faPen} />
              <FontAwesomeIcon onClick={onDeleteBoard} className="delete card-icon" type="button" icon={faTrashCan} />
            </IconContainer>
          </TitleContainer>

          <Droppable droppableId={boardId+""}>
            {(magic, snapshot) => (
              <Area isDraggingOver={snapshot.isDraggingOver} 
                    draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)} ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} boardId={boardId} />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>

          <Form onSubmit={handleSubmit(onValue)}>
            <input {...register("toDo", {required:true}) } type="text" placeholder={`${boardName}에 추가하기`} />
          </Form>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);