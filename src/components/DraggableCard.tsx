import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

const IconContainer = styled.div<{isDragging:boolean}>`
    display: flex;
    white-space: nowrap;
    position: absolute;
    top: 0.55rem;
    right: 0.5rem;
    border-radius: 0.25rem;
    .card-icon {
        cursor: pointer;
        border-radius: 0.25rem;
        padding: 0.4rem;
        background-color: ${(props) => props.theme.cardColor};
        transition: background-color 0.2s ease-in;
        box-shadow: 0rem 0rem 0rem 0.06rem rgba(15, 15, 15, 0.1),
                    0rem 0.1rem 0.2rem rgba(15, 15, 15, 0.1);
        opacity: ${(props) => props.isDragging ? 0.2 : 0};
    }
    .card-icon:hover {
        background-color: ${(props) => props.theme.cardHoverBgColor};
        transition: background-color 0.1s ease 0.1s;
    }
`;

const Card = styled.div<{isDragging:boolean}>`
  border-radius: 0.4rem;
  margin-bottom: 0.5rem;
  padding: 0.8rem 0.7rem;
  background-color: ${(props) =>
    props.isDragging ? props.theme.cardHoverBgColor : props.theme.cardColor};
  transition: background-color 0.2s ease-in;
  box-shadow: 0rem 0.125rem 0.3rem rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  line-height: 1.3rem;
  font-size: 0.95rem;
  &:hover {
    background-color: ${(props) => props.theme.cardHoverBgColor};
  }
  &:hover ${IconContainer} .card-icon {
    opacity: 1;
    transition: opacity 0.2s ease 0.1s;
  }
`;

interface IDraggableCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
    boardId: number;
}

function DraggableCard({ toDoId, toDoText, index, boardId }:IDraggableCardProps) {
    const setBoards = useSetRecoilState(toDoState);
    const onDeleteToDo = () => {
        if(window.confirm(`${toDoText}를 삭제하시겠습니까?`)) {
            setBoards((allBoards) => {
                const allBoardsCopy = [...allBoards];
                const boardIndex = allBoardsCopy.findIndex(board => board.id === boardId);
                const boardCopy = {...allBoardsCopy[boardIndex]};
                const targetToDosCopy = [...boardCopy.toDos];
                const targetToDoIndex = targetToDosCopy.findIndex((toDo) => toDo.id === toDoId);
                // 해당 toDo item 삭제
                targetToDosCopy.splice(targetToDoIndex, 1);
                boardCopy.toDos = targetToDosCopy;
                allBoardsCopy.splice(boardIndex, 1, boardCopy);
                return allBoardsCopy;
            });
        };
    }
    return (
        <Draggable draggableId={toDoId+""} index={index}>
            {(magic, snapshot) => (
                <Card isDragging={snapshot.isDragging}
                      ref={magic.innerRef} {...magic.draggableProps} {...magic.dragHandleProps}>
                    {toDoText}
                    <IconContainer isDragging={snapshot.isDragging}>
                        <FontAwesomeIcon className="card-icon" type="button" icon={faPen} />
                        <FontAwesomeIcon onClick={onDeleteToDo} className="delete card-icon" type="button" icon={faTrashCan} />
                    </IconContainer>
                </Card>
            )}
        </Draggable>
    )
}

export default React.memo(DraggableCard);
