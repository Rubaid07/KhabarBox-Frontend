import Navbar from "@/components/shared/Navbar";

const CommonLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default CommonLayout;