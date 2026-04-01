import RegisterForm from "../components/RegisterForm";
import Layout from "../components/Layout";



export default function RegisterPage() {
    return (
        <Layout>
            <div>
                <h1>Create your account</h1>
                <div><RegisterForm/></div>
            </div>
        </Layout>
    )
}