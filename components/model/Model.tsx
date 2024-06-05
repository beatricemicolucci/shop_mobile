// Model.tsx
import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface ModelProps {
  url: string;
  setLoading: (loading: boolean) => void;
}

const Model: React.FC<ModelProps> = ({ url, setLoading }) => {
  const obj = useLoader(OBJLoader, url);

  useEffect(() => {
    setLoading(false);
  }, [obj]);

  return <primitive object={obj} />;
};

export default Model;
