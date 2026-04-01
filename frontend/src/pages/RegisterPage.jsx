import RegisterForm from "../components/RegisterForm";
import Layout from "../components/Layout";



export default function RegisterPage() {
    return (
        <Layout>
            <div className="text-center mt-5 p-2 bg-white m-40 border">
                <h1>Create your account</h1>
                <div><RegisterForm/></div>
            </div>
        </Layout>
    )
}