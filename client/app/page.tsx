"use client";
import Image from "next/image";
import Todo from "./components/Todo";
import useSWR from "swr";
import { features } from "process";

import { useEffect, useRef } from 'react';
import { todo } from "node:test";
import { TodoType } from "./types";
import { useRouter } from "next/navigation";
import { useTodos } from "./hooks/useTodos";


// コンポーネント（UIを一部の独立した再利用可能な部品としてカプセル化したもの）の定義
// この中でuseSWRを使用しているため、これがマウントされるとfetcherが実行される
// →マウント＝コンポーネントが画面上に初めて出現することを意味する
// fetcherから受け取った結果をdataに入れる
export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // カスタム関数を準備
  const { todos, isLoading, error, mutate} = useTodos();

  // console.log("取得後情報")
  // console.log(data)
  const handlesubmit = async(e: React.FormEvent) => {
    console.log("新しいタスクAA")
    e.preventDefault()//ページリロードを止める

    // //入力した内容が取得できているのかを確認するための処理だったからコメントアウトした
    // if (inputRef.current) {
    //   console.log("新しいタスク")
    //   console.log(inputRef.current?.value)
    // }

    const response = await fetch(`http://localhost:8080/createTodo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputRef.current?.value,
        isCompleted: false
      })
    });

    router.refresh();
    if (response.ok) {
      const newTodo = await response.json();
      mutate([...todos, newTodo]);
      inputRef.current!.value = "";
    }

  }


  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
      </div>

      {/* タスク追加フォーム */}
      <form className="w-full max-w-sm mx-auto px-4 py-2" onSubmit={ handlesubmit}>{/* ユーザがフォームを送信するとき */}
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>

      {/* タスクリスト */}
      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          // todoは配列で、dataを意味する
          // データ取得apiからreturnさるときのdata

          // keyはMapを使うときに必要なもの
          //todo={todo}はTodoコンポーネントにtodoというpropsを渡している
          // 左辺がTodoコンポーネントを表る
          // todoにはtodo全体を入れて渡すって感じ
          // Reactでは、keyは特別な属性として扱われているため、子コンポーネントには渡らない
          // 親、子コンポーネントについてだけどexport default function Home() {が親コンポーネント
          // この下の行で小コンポーネントを呼び出している感じ
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
