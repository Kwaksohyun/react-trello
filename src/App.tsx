import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { ReactComponent as AddLibraryIcon } from "./assets/add_library_my_icon.svg";
import { ReactComponent as LightIcon } from "./assets/sun_icon.svg";
import { ReactComponent as DarkIcon } from "./assets/moon_icon.svg";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { isDarkState, toDoState } from "./atoms";
import Board from "./components/Board";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Nanum Gothic', sans-serif;
    background-color: ${props => props.theme.bgColor};
    color: ${props => props.theme.textColor};
    transition: background-color 0.2s ease-in, color 0.2s ease-in;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  input:focus {
    outline: none;
  }
`;

const HeaderWrapper = styled.div`
  padding: 3rem;
  height: 8.85rem;
  position: sticky;
  left: 0rem;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 2.4rem;
    font-weight: 800;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  .button-icon {
    position: relative;
    padding: 0.2rem;
    border-radius: 0.25rem;
    fill: ${props => props.theme.textColor};
    transition: background-color 0.2s ease-in;
  }
  .light-icon {
    stroke: ${props => props.theme.textColor};
  }
  .button-icon:hover {
    background-color: ${props => props.theme.headerIconHoverColor};
    transition: background-color 0.2s ease;
  }
  .button-icon:active {
    background-color: ${props => props.theme.headerIconActiveColor};
  }
`;

const FormContainer = styled.div`
  z-index: 1;
  position: absolute;
  right: 6.1rem;
  top: 5.9rem;
  form {
    width: 100%;
    border-radius: 0.3rem;
    box-shadow: 0rem 0.19rem 0.4rem rgba(15, 15, 15, 0.1),
                0rem 0.5rem 1.5rem rgba(15, 15, 15, 0.1);
  }
  input {
    border: none;
    border-radius: 0.3rem;
    width: 100%;
    padding: 0.7rem;
    font-size: 1rem;
  }
`;

const ThemeButton = styled.button`
  border: none;
  background: none no-repeat;
  padding: 0;
`;

const MainWrapper = styled.main`
  display: flex;
  padding: 0rem 3rem;
  height: calc(100vh - 8.85rem);
  overflow: auto hidden;
`;

const Boards = styled.div`
  display: flex;
`;

interface IAddBoardForm {
  board: string;
}

function App() {
  const [boards, setBoards] = useRecoilState(toDoState);
  const [isOpenBoardForm, setIsOpenBoardForm] = useState(false);
  const [isDark, setIsDarkState] = useRecoilState(isDarkState);
  const boardFormRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, setValue } = useForm<IAddBoardForm>();
  const onClick = () => {
    setIsOpenBoardForm(!isOpenBoardForm);
  };
  const toggleDarkAtom = () => setIsDarkState(prev => !prev);

  const onValue = ({board}:IAddBoardForm) => {
    // 문자열 양 끝 공백 제거
    const filterBoard = board.trim();
    const newBoard = {
      id: Date.now(),
      boardName: filterBoard,
      toDos: [],
    };
    if(filterBoard !== null && filterBoard !== undefined && filterBoard !== "") {
      setBoards((allBoards) => {
        return [...allBoards, newBoard];
      });
    }
    setValue("board", "");
  };
  
  /* 외부 영역을 클릭했을 때 input칸이 닫히도록 */
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      // input이 열려있고 ref 외부 영역을 눌렀을 때 창 닫기
      if(isOpenBoardForm && boardFormRef.current && !boardFormRef.current.contains(event.target as Node)) {
        setIsOpenBoardForm(false);
      }    
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenBoardForm]);

  const onDragEnd = ({ destination, draggableId, source, type }:DropResult) => {
    if(!destination) return;
    // Board 이동
    if(type === "BOARDS") {   
      console.log(type, destination, draggableId, source);
      setBoards((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const targetBoardCopy = allBoardsCopy[source.index];
        allBoardsCopy.splice(source.index, 1);
        allBoardsCopy.splice(destination?.index, 0, targetBoardCopy);
        return allBoardsCopy;
      })
    } else {    // Card 이동
      // 같은 Board 이동
      if(destination?.droppableId === source.droppableId) {
        setBoards((allBoards) => {
          const allBoardsCopy = [...allBoards];
          const boardIndex = allBoardsCopy.findIndex((board)=> board.id === +source.droppableId);
          // 변화가 일어난 board의 object 복사
          const boardCopy = {...allBoardsCopy[boardIndex]};
          // toDos array
          const toDosCopy = [...boardCopy.toDos];
          const targetTaskObj = toDosCopy[source.index];
          // 1) source.index 위치의 item 삭제
          toDosCopy.splice(source.index, 1);
          // 2) destination.index에 item 다시 놓기
          toDosCopy.splice(destination?.index, 0, targetTaskObj);
    
          boardCopy.toDos = toDosCopy;
          allBoardsCopy.splice(boardIndex, 1, boardCopy);
          return allBoardsCopy;
        });
      };
      // 다른 Board 이동
      if(destination.droppableId !== source.droppableId) {
        setBoards((allBoards) => {
          const allBoardsCopy = [...allBoards];
          const sourceBoardIndex = allBoardsCopy.findIndex((board)=> board.id === +source.droppableId);
          const sourceBoard = {...allBoardsCopy[sourceBoardIndex]};
          const sourceToDosCopy = [...sourceBoard.toDos];
          const taskObj = sourceToDosCopy[source.index];
          
          const destinationBoardIndex = allBoardsCopy.findIndex((board) => board.id === +destination.droppableId);
          const destinationBoard = {...allBoards[destinationBoardIndex]};
          const destinationToDosCopy = [...destinationBoard.toDos];

          sourceToDosCopy.splice(source.index, 1);
          destinationToDosCopy.splice(destination?.index, 0, taskObj);

          sourceBoard.toDos = sourceToDosCopy;
          destinationBoard.toDos = destinationToDosCopy;

          allBoardsCopy.splice(sourceBoardIndex, 1, sourceBoard);
          allBoardsCopy.splice(destinationBoardIndex, 1, destinationBoard);
          return allBoardsCopy;
        })
      };
    };
  }
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <HeaderWrapper>
          <Header>
            <h1>Board</h1>
            <IconContainer ref={boardFormRef}>
              <AddLibraryIcon className="button-icon" type="button" onClick={onClick} cursor="pointer" width="38" height="38" />
              {isOpenBoardForm && (
                <FormContainer>
                  <form onSubmit={handleSubmit(onValue)}>
                    <input {...register("board", {required:true}) } type="text" placeholder={`새 보드의 이름`} />
                  </form>
                </FormContainer>
              )}
              <ThemeButton title="theme 변경" type="button" onClick={toggleDarkAtom}>
                {isDark ? <LightIcon className="light-icon button-icon" width="38" height="38" /> : (
                  <DarkIcon className="button-icon" width="38" height="38" />
                )}
              </ThemeButton>
            </IconContainer>
          </Header>
        </HeaderWrapper>

        <MainWrapper>
          <DragDropContext onDragEnd={onDragEnd}>        
            <Droppable droppableId="boards" type="BOARDS" direction="horizontal">
              {(provided) => (
                <Boards ref={provided.innerRef} {...provided.droppableProps}>
                  {boards.map((board, index) => (
                    <Board key={board.id} index={index} boardId={board.id} boardName={board.boardName} toDos={board.toDos} />
                  ))}
                  {provided.placeholder}
                </Boards>
              )}
            </Droppable>
          </DragDropContext>
        </MainWrapper>
      </ThemeProvider>
    </>
  );
}

export default App;