import Layout from "../components/Layout";
import AuthForm from "../components/AuthForm";


export default function AuthPage() {
    return (
        <Layout>
            <div className="text-center mt-5 p-2 bg-white m-40 border">
                <AuthForm/>
            </div>
        </Layout>
    )
}