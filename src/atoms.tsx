import { atom } from "recoil";

export const isDarkState = atom({
    key: "isDark",
    default: false,
});

// {id: 0, text: "hello"}
export interface ITodo {    
    id: number;
    text: string;
}

// { id: 0, boardName: "To Do", toDos: [{id: 0, text: "hello"}, ...]}
interface IBoard {
    id: number;
    boardName: string;
    toDos: ITodo[];
}

const localStorageEffect = (key:string) => ({ setSelf, onSet }:any) => {
    const savedValue = localStorage.getItem(key);
    if(savedValue != null) {
        // setSelf : atom 값을 설정 혹은 재설정
        setSelf(JSON.parse(savedValue));
    }
    // onSet : atom 변화가 감지될 때 작동하며 Storage에 데이터 저장
    onSet((newValue:IBoard[]) => {
        localStorage.setItem(key, JSON.stringify(newValue));
    });
};

export const toDoState = atom<IBoard[]>({
    key: "toDos",
    default: [
        {
            id: 0,
            boardName: "할 일",
            toDos: [] 
        },
        { 
            id: 1, 
            boardName: "진행 중", 
            toDos: [] 
        },
        { 
            id: 2, 
            boardName: "완료", 
            toDos: [] 
        },
    ],
    effects: [localStorageEffect("toDos")],
});
