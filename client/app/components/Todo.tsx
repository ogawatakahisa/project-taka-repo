import Rafce, { useState } from "react";
import { TodoType } from "../types"
import useSWR from "swr";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "../constants/url";

type TodoProps = {
    todo: TodoType;
}

// async function fetcher(key: string) {
//     // .then=非同期処理の結果を受け取る
//     // 指定したエンドポイ　ントから.thenで値を受け取り
//     // json形式で返す
//     return fetch(key).then((res) => res.json());
// }

const Todo = ({ todo }: TodoProps) => {
    // ISEditingにstateの状態が入る
    // setIsEdtingは関数で、IsEditingの状態を変える
    const [isEditing, setIsEditing] = useState(false);
    // 編集ボタンを押した時にinputに書かれている文字列を残す
    // もともと入っていた値editedTitleに新しく入力されたsetEditedTitleを入れる
    const [editedTitle, setEditedTitle] = useState<string>(todo.title);

    // カスタム関数を準備
    const { todos, isLoading, error, mutate} = useTodos();

    // // useSWR＝APIのデータ取得（フェッチ）を簡単にできる
    // // &関数コンポーネントでstateを管理できる
    // const { data, isLoading, error, mutate } = useSWR(
    //     "http://localhost:8080/allTodos",
    //     // 引数ないように見えるけど、useSWRの仕組みで自動でつけてくれてる
    //     // この時の引数はuseSWRで呼び出したAPIのurlが渡される
    //     fetcher
    // );

    const handleEdit = async() => {
        // ONとOFを切り替える
        // setIsEditing(!IsEditing);　// 非推奨
        setIsEditing((prev) => !prev); //関数型の更新
        // この時のisEditingは変更前のisEditingの値を見ている
        // →useStateは次のレンダリング時に反映される仕組みになっている
        // mutate があるおかげで際レンダリングされる
        if (isEditing) {
            const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editedTitle })
            });

            if (response.ok) {
                const editieTodo = await response.json();
                //SWRのキャッシュを更新する 
                // キャッシュが新しいdataに変わる＝再レンダリングされる
                const updatedTodos = todos.filter((todo: TodoType) =>
                    todo.id === editieTodo.id ? editieTodo : todo);
                // mutate([...todos, editieTodo]); 
                mutate(updatedTodos); 
                // setEditedTitle("")
            }
        }
    }

    const handleDelete = async(id: number) => {
        const response = await fetch(`${API_URL}/deleteTodo/${todo.id}`, {
            method: "DELETE",
            // deleteする時にはheaderもbodyも必要ない
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const deletedTodo = await response.json();
            const updatedTodos = todos.filter((todo: TodoType) => todo.id !== id);
            mutate(updatedTodos);
            // mutate([...todos, deletedTodo]);
            // setEditedTitle("")
        }
    }
    
    const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
        const response = await fetch(`${API_URL}/editTodo/${todo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted: !isCompleted })
        });
        console.log(`状態${isCompleted}`)
    
        if (response.ok) {
            const editieTodo = await response.json();
            const updatedTodos = todos.map((todo: TodoType) =>
                todo.id === editieTodo.id ? editieTodo : todo
            );
            mutate(updatedTodos);
        }
    };
    


    return (
    <div>
        <li className="py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <input
                id="todo1"
                name="todo1"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                onChange={() => toggleTodoCompletion(todo.id, todo.isCompleted)}
            />
            <label className="ml-3 block text-gray-900">
                {isEditing ? (
                    <input
                        type="text"
                        className="border rounded py-1 px2"
                        value={editedTitle} 
                        // eとは、イベントオブジェクトで、ユーザが行った操作に関する情報を持つ
                        // e.targetはイベントが発生した要素を指す
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />              
                ): (
                    <span
                    className={`text-lg font-medium mr-2 ${todo.isCompleted ? "line-through" : ""}`}

                    >
                    {todo.title}
                </span>
                )}
            </label>
            </div>

          {/* 編集・削除ボタン */}
            <div className={`flex items-center space-x-2`}>
            <button onClick={handleEdit}
                className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded">
                
                {isEditing ? "Save": "✒"}            
            </button>
            <button onClick={() => handleDelete(todo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded">
                ✖
            </button>
            </div>
        </div>
        </li>
    </div>
    );
};

export default Todo;
