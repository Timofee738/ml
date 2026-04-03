import Layout from "../components/Layout";
import AuthForm from "../components/AuthForm";

export default function AuthPage() {
  return (
    <Layout>
      <div>
        <h1 className="mb-2 text-xl font-semibold text-slate-100">login</h1>
        <p className="mb-5 text-sm text-slate-300">sign in to open your feed.</p>
        <AuthForm />
      </div>
    </Layout>
  );
}
