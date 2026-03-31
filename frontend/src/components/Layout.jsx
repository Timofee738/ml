

export default function Layout({ children }) {
    return (
        <div className="min-h-screen w-full bg-grey-300">
            <div>
                {children}
            </div>
        </div>
    )
}