import { UserOutlined } from "@ant-design/icons";

export const MainSection = () => {
  return (
    <section className="flex h-full w-full items-center justify-center p-4">
      <div className="card flex flex-col items-center gap-6 p-12 text-center rounded-3xl max-w-sm w-full">
        <div className="rounded-full bg-(--primary)/10 p-4">
          <UserOutlined className="text-4xl text-(--primary)" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-(--foreground)">
            歡迎回來，管理員
          </h1>
          <p className="text-(--muted)">請從左側選單選擇功能</p>
        </div>
      </div>
    </section>
  );
};
