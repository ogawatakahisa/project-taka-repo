import express from "express";
import type { Express, Request, Response } from "express";
import {PrismaClient} from "@prisma/client" //prismでDBを操作するときに必須のもの
import cors from "cors"

// Expressは、APIとかWebサーバを簡単に作れる
// パスごとの処理を簡単にかけたり、POST、GETも簡単にかける
const app: Express = express();
const PORT = 8080;

// ミドルウェア設定
// リクエストとレスポンスの間
// すべてのリクエストで毎回実行される処理をかける
app.use(express.json()) //Json形式を使いますよ
app.use(cors());// どのポートでもいいよ
const prisma = new PrismaClient();

// GET /allTodos: テーブルの値を返す
// Promise＝非同期処理。この処理をしている間、他のことできる
app.get("/allTodos", async (req: Request, res: Response): Promise<void> => {
    // awaitを使うと.thenを使う必要ない
    // 逆にPromiseだけの時は.thenを使って同期
    const allTodos = await prisma.todo.findMany();
    res.json(allTodos)
});

// POST /createTodo: 新しいTodo項目を作成
// ここにはないけど、resoleveは成功した時の処理、rejectは失敗した時の処理
// async＝関数をPromise(非同期のオブジェクト)を返すて言う
// asyncを書くと返り値が自動でPromiseになる
app.post("/createTodo", async(req: Request, res: Response): Promise<void> => {
    
    try {
        const { title, isCompleted } = req.body;
        
        // 新しいエントリ（行）を新しい行に挿入する
        const createTodos = await prisma.todo.create({
            data: {
                title,
                isCompleted,
            }
        });
        res.json(createTodos)
    } catch (e) {
        res.status(400).json(e);
    }
});
// put /editTodo/:id: 編集
// :＝任意のという意味になる。1が来たらidの部分が1
app.put("/editTodo/:id", async(req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);//:idを取得する
        const { title, isCompleted } = req.body;

        const editTodo = await prisma.todo.update({
            where: {id},
            data: {
                title,
                isCompleted,
            }
        });
        res.json(editTodo)
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /createTodo: 新しいTodo項目を作成
app.delete("/deleteTodo/:id", async(req: Request, res: Response): Promise<void> => {
    
    try {
        const id = Number(req.params.id);//:idを取得する
        const deleteTodos = await prisma.todo.delete({
            where: {id},
        });
        res.json(deleteTodos)
    } catch (e) {
        res.status(400).json(e);
    }
});

app.listen(PORT, () => console.log("server is runnning"))
