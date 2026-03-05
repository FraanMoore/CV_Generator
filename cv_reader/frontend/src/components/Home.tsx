import Navbar from "./Navbar";
import PostulationCard from "./PostulationCard";

const Home = () => {
    return (
        <>
            <Navbar />
            <PostulationCard company={'test company'} role={'test role'} jobURL={'https://example.com'} status={'applied'} notes={'No notes available'} jobDescription={'No description available'} keyWords={'keyword1, keyword2'} />
        </>
    );
};
export default Home;