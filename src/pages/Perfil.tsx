import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, storage } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiCamera } from 'react-icons/fi';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { point, distance as turfDistance } from '@turf/turf';

// ==================== ESTILOS ====================
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 2.8rem 2.5rem;
  border-radius: 18px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const Title = styled.h2`
  color: #0f172a;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 1.8rem;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.8rem;
`;

const ProfileImage = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 3px solid #2563eb;
  object-fit: cover;
  background-color: #f1f5f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const CameraButton = styled.label`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: #2563eb;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  border: 3px solid #fff;
  transition: background 0.3s;
  &:hover {
    background-color: #1d4ed8;
  }
  input {
    display: none;
  }
`;

const Field = styled.div`
  text-align: left;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
`;

const Value = styled.p`
  background-color: #f1f5f9;
  padding: 0.9rem;
  border-radius: 10px;
  color: #0f172a;
  font-size: 1rem;
  margin-top: 0.3rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 1rem;
  color: #0f172a;
  transition: all 0.2s;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const EditButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  margin-top: 1.5rem;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  justify-content: center;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  text-align: center;
  min-width: 110px;
`;

const StatNumber = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: #0f172a;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #475569;
`;

const UploadProgress = styled.div<{ progress: number }>`
  background-color: #f1f5f9;
  border-radius: 10px;
  margin: 0.5rem 0 1rem 0;
  height: 10px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #2563eb;
    width: ${({ progress }) => progress}%;
    transition: width 0.3s ease;
  }
`;

const Loading = styled.div`
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
`;

// ==================== INTERFACES ====================
interface UserData {
  nome: string;
  email: string;
  imagemUrl: string;
}

// ==================== COMPONENTE PRINCIPAL ====================
const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Estatísticas
  const [totalPeixes, setTotalPeixes] = useState<number>(0);
  const [topEspecie, setTopEspecie] = useState<string>('—');
  const [totalKm, setTotalKm] = useState<number>(0);

  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async (user: any) => {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            nome: data.nome,
            email: data.email,
            imagemUrl: data.imagemUrl || 'https://via.placeholder.com/150'
          });
        } else {
          const defaultUserData: UserData = {
            nome: user.displayName || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
            imagemUrl: 'https://via.placeholder.com/150'
          };
          await setDoc(userDoc, { ...defaultUserData, uid: user.uid, createdAt: new Date() });
          setUserData(defaultUserData);
        }

        // buscar e calcular estatísticas
        await fetchFishingStats(user.uid);
      } catch (err) {
        setError('Erro ao carregar dados: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Busca os registros de pesca e calcula agregados no cliente
  const fetchFishingStats = async (uid: string) => {
    try {
      // ajuste o nome da coleção para a que você usa (ex: 'registros' ou 'fishingRecords')
      const regsCol = collection(db, 'registros');
      const q = query(regsCol, where('uid', '==', uid));
      const snap = await getDocs(q);

      let fishCount = 0;
      const speciesMap: Record<string, number> = {};
      let kmSum = 0;

      snap.forEach((docSnap) => {
        const data: any = docSnap.data();

        // quantidade de peixes neste registro: tenta campos 'count'|'quantidade'|'peixes' ou assume 1
        const thisCount = data.count ?? data.quantidade ?? data.peixes ?? 1;
        fishCount += Number(thisCount) || 0;

        // espécie: tenta 'species'|'especie'|'speciesName'
        const specie = data.species ?? data.especie ?? data.speciesName ?? 'Desconhecida';
        speciesMap[specie] = (speciesMap[specie] || 0) + (Number(thisCount) || 1);

        // calcular distância do registro:
        // espera-se que cada registro tenha array 'locations' [{lat, lng}] ou [{latitude, longitude}]
        const locs = data.locations ?? data.localizacoes ?? data.track;
        if (Array.isArray(locs) && locs.length > 1) {
          for (let i = 0; i < locs.length - 1; i++) {
            const a = locs[i];
            const b = locs[i + 1];

            const latA = a.lat ?? a.latitude ?? (Array.isArray(a) ? a[1] : undefined);
            const lonA = a.lng ?? a.longitude ?? (Array.isArray(a) ? a[0] : undefined);
            const latB = b.lat ?? b.latitude ?? (Array.isArray(b) ? b[1] : undefined);
            const lonB = b.lng ?? b.longitude ?? (Array.isArray(b) ? b[0] : undefined);

            if (latA != null && lonA != null && latB != null && lonB != null) {
              try {
                const p1 = point([Number(lonA), Number(latA)]);
                const p2 = point([Number(lonB), Number(latB)]);
                const d = turfDistance(p1, p2, { units: 'kilometers' }) ?? 0;
                kmSum += d;
              } catch {
                // ignora pontos inválidos
              }
            }
          }
        }
      });

      // calcular espécie mais capturada
      let top = '—';
      let topCount = 0;
      Object.entries(speciesMap).forEach(([s, c]) => {
        if (c > topCount) {
          top = s;
          topCount = c;
        }
      });

      setTotalPeixes(fishCount);
      setTopEspecie(top);
      setTotalKm(Math.round(kmSum * 100) / 100); // 2 casas decimais
    } catch (err) {
      console.error('Erro ao calcular estatísticas:', err);
    }
  };

  const handleEdit = async () => {
    try {
      if (!isEditing) {
        setIsEditing(true);
        return;
      }

      if (!auth.currentUser || !userData) {
        throw new Error('Dados inválidos');
      }

      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { nome: userData.nome, imagemUrl: userData.imagemUrl });
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao salvar: ' + (err as Error).message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!auth.currentUser) {
      setError('Usuário não autenticado');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (userData) setUserData({ ...userData, imagemUrl: reader.result as string });
    };
    reader.readAsDataURL(file);

    const uid = auth.currentUser.uid;
    const path = `profileImages/${uid}/${Date.now()}_${file.name}`;
    const sRef = storageRef(storage, path);
    const uploadTask = uploadBytesResumable(sRef, file);

    setIsUploading(true);
    setUploadProgress(0);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (uploadError) => {
        setIsUploading(false);
        setError('Erro no upload: ' + (uploadError as Error).message);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userDoc = doc(db, 'users', uid);
          await updateDoc(userDoc, { imagemUrl: downloadURL });
          if (userData) setUserData({ ...userData, imagemUrl: downloadURL });
        } catch (err) {
          setError('Erro ao salvar imagem: ' + (err as Error).message);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }
    );
  };

  if (isLoading) return <Loading>Carregando...</Loading>;
  if (error) return <div>Erro: {error}</div>;
  if (!userData) return <div>Sem dados do usuário</div>;

  return (
    <Container>
      <Card>
        <Title>Seu Perfil</Title>

        <StatsContainer>
          <StatCard>
            <StatNumber>{totalPeixes}</StatNumber>
            <StatLabel>Peixes pescados</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{topEspecie}</StatNumber>
            <StatLabel>Espécie mais capturada</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{totalKm} km</StatNumber>
            <StatLabel>Km no mar (estim.)</StatLabel>
          </StatCard>
        </StatsContainer>

        <ProfileImageWrapper>
          <ProfileImage src={userData.imagemUrl} alt="Foto de perfil" />
          <CameraButton title={isUploading ? 'Fazendo upload...' : 'Alterar foto'}>
            <FiCamera size={18} />
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
          </CameraButton>
        </ProfileImageWrapper>

        {isUploading && <UploadProgress progress={uploadProgress} />}

        <Field>
          <Label>Nome</Label>
          {isEditing ? (
            <Input
              value={userData.nome}
              onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
            />
          ) : (
            <Value>{userData.nome}</Value>
          )}
        </Field>

        <Field>
          <Label>E-mail</Label>
          <Value>{userData.email}</Value>
        </Field>

        <EditButton onClick={handleEdit}>
          <FiEdit2 />
          {isEditing ? 'Salvar alterações' : 'Editar perfil'}
        </EditButton>
      </Card>
    </Container>
  );
};

export default Perfil;
