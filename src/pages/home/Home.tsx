import { useEffect } from 'react';
import ProfileAPI from '../../api/profile';
export default function Home() {

  const handleGetAll = async () => {
    const { data } = await ProfileAPI.getAll();
    console.log(data)
  }

  useEffect(() => {
    handleGetAll();
  }, [])

  return (
    <section>
      Home Page
    </section>
  );
}
