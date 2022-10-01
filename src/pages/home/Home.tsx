import { useContext } from 'react';
import { AppContext } from '../../context';
export default function Home() {
  const { state } = useContext(AppContext);

  return (
    <section>
      <pre>{JSON.stringify(state, undefined, 2)}</pre>
    </section>
  );
}
