import RegisterForm from "../components/RegisterForm";
import Layout from "../components/Layout";

export default function RegisterPage() {
  return (
    <Layout>
      <div>
        <h1 className="mb-2 text-xl font-semibold text-slate-100">create account</h1>
        <p className="mb-5 text-sm text-slate-300">join the platform and publish your posts.</p>
        <RegisterForm />
      </div>
    </Layout>
  );
}
