// useTodoを呼び出すだけでtodoのデータが使えるようになる
// 要はロジックを分解して再利用性を高めたってこと

import useSWR from "swr";

// APIから取得する
async function fetcher(key: string) {
    // .then=非同期処理の結果を受け取る
    // 指定したエンドポイ　ントから.thenで値を受け取り
    // json形式で返す
    return fetch(key).then((res) => res.json());
}

export const useTodos = () => {
    // useSWR＝APIのデータ取得（フェッチ）を簡単にできる
    // &関数コンポーネントでstateを管理できる
    const { data, isLoading, error, mutate } = useSWR(
        "http://localhost:8080/allTodos",
        // 引数ないように見えるけど、useSWRの仕組みで自動でつけてくれてる
        // この時の引数はuseSWRで呼び出したAPIのurlが渡される
        fetcher
    );

    return {
        todos: data,
        isLoading,
        error,
        mutate,
    }
}