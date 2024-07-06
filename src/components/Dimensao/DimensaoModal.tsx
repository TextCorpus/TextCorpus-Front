import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import Plot from 'react-plotly.js';
import { useParams } from 'react-router-dom'; // Importa o hook useParams
import UserStorage from '../../util/UserStorage';

interface Document {
  titulo: string;
  textdimension: {
    entropy: number;
  };
  graphdimension: {
    averageClusteringCoefficient: number;
    nodeEdgeRatio: number;
  };
  totals?: {
    betweennessCentrality: number;
    closenessCentrality: number;
    count: number;
    degree: number;
    degreeCentrality: number;
    entropy: number;
    localClusteringCoefficient: number;
    probability: number;
    rank: number;
    suffixesSum: number;
  };
}

const DimensaoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [distances, setDistances] = useState<{ title: string; distance: number }[]>([]);
  const [totalsDistances, setTotalsDistances] = useState<{ title: string; totalsDistance: number | string }[]>([]);
  const { id } = useParams<{ id: string }>(); // Obtém o parâmetro 'id' da URL

  useEffect(() => {
    const fetchData = async () => {
      try {
       const token = UserStorage.getToken();
        const response = await fetch(`http://185.137.92.41:3001/projetos/ods/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await response.json();
        setDocuments(data.documentos);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]); // Executa novamente quando o 'id' muda

  const euclideanDistance = (vec1: number[], vec2: number[]) => {
    return Math.sqrt(vec1.reduce((sum, val, i) => sum + Math.pow(val - vec2[i], 2), 0));
  };

  const getTotalsVector = (totals: any) => {
    return [
      totals.betweennessCentrality,
      totals.closenessCentrality,
      totals.count,
      totals.degree,
      totals.degreeCentrality,
      totals.entropy,
      totals.localClusteringCoefficient,
      totals.probability,
      totals.rank,
      totals.suffixesSum
    ];
  };

  const handleHover = (data: any) => {
    const hoverPoint = data.points[0];
    const pointIndex = hoverPoint.pointNumber;
    if (typeof pointIndex === 'undefined') return;

    const hoverCoords = [hoverPoint.x, hoverPoint.y, hoverPoint.z];
    const hoverTotalsVector = documents[pointIndex]?.totals ? getTotalsVector(documents[pointIndex].totals) : [];

    const pointDistances = documents.map((doc, index) => {
      if (pointIndex === index) return null; // Skip the hovered point
      const pointCoords = [
        doc.textdimension.entropy,
        doc.graphdimension.averageClusteringCoefficient,
        doc.graphdimension.nodeEdgeRatio
      ];
      const distance = euclideanDistance(hoverCoords, pointCoords);
      return {
        title: doc.titulo,
        distance
      };
    }).filter(item => item !== null) as { title: string; distance: number }[];

    const vectorDistances = documents.map((doc, index) => {
      if (pointIndex === index) return null; // Skip the hovered point
      const currentTotalsVector = doc.totals ? getTotalsVector(doc.totals) : [];
      if (hoverTotalsVector.length === 0 || currentTotalsVector.length === 0) return null;
      const totalsDistance = euclideanDistance(hoverTotalsVector, currentTotalsVector);
      return {
        title: doc.titulo,
        totalsDistance
      };
    }).filter(item => item !== null) as { title: string; totalsDistance: number | string }[];

    setDistances(pointDistances);
    setTotalsDistances(vectorDistances);
  };

  const x = documents.map(doc => doc.textdimension.entropy);
  const y = documents.map(doc => doc.graphdimension.averageClusteringCoefficient);
  const z = documents.map(doc => doc.graphdimension.nodeEdgeRatio);
  const text = documents.map(doc => doc.titulo);

  const odsColors: { [key: string]: string } = {
    "ODS 01": "#E5243B",
    "ODS 02": "#DDA63A",
    "ODS 03": "#4C9F38",
    "ODS 04": "#C5192D",
    "ODS 05": "#FF3A21",
    "ODS 06": "#26BDE2",
    "ODS 07": "#FCC30B",
    "ODS 08": "#A21942",
    "ODS 09": "#FD6925",
    "ODS 10": "#DD1367",
    "ODS 11": "#FD9D24",
    "ODS 12": "#BF8B2E",
    "ODS 13": "#3F7E44",
    "ODS 14": "#0A97D9",
    "ODS 15": "#56C02B",
    "ODS 16": "#00689D",
    "ODS 17": "#19486A"
  };

  const otherColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  const colors = documents.map((doc, index) => {
    return odsColors[doc.titulo] || otherColors[index % otherColors.length];
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dimensão de Resultados</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
            <div style={{
              width: '30%', // Ajuste de largura da lista lateral
              height: '100%',
              overflowY: 'auto',
              padding: '10px',
              boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div>
                <h3>Distâncias do Ponto</h3>
                <div>
                  {distances.map((item, index) => (
                    <div key={index} style={{
                      marginBottom: '5px',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '3px'
                    }}>
                      {item.title}: {item.distance.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3>Distâncias do Vetor</h3>
                <div>
                  {totalsDistances.map((item, index) => (
                    <div key={index} style={{
                      marginBottom: '5px',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '3px'
                    }}>
                      {typeof item.totalsDistance === 'number' ? `${item.title}: ${item.totalsDistance.toFixed(2)}` : `${item.title}: ${item.totalsDistance}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              width: '70%', // Ajuste de largura do gráfico
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Plot
                data={[{
                  x,
                  y,
                  z,
                  text,
                  mode: 'markers',
                  marker: {
                    size: 12,
                    color: colors,
                    opacity: 0.8
                  },
                  type: 'scatter3d',
                }]}
                layout={{
                  margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 0
                  },
                  scene: {
                    xaxis: { title: 'Entropia' },
                    yaxis: { title: 'Coeficiente de Clustering Médio' },
                    zaxis: { title: 'Relação Nós-Arestas' }
                  }
                }}
                onHover={handleHover}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DimensaoModal;
