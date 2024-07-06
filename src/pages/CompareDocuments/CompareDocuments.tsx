import React from "react";
import { Flex, Text, Checkbox } from "@chakra-ui/react";
import { Documentos } from "../../entity/Documentos/Documentos";

interface CompareDocumentsProps {
  documentos: Documentos[];
  onSelectDocument: (documentId: number) => void;
  selectedDocuments: Set<number>;
  side: "left" | "right"; // Corrigido para aceitar apenas "left" ou "right"
}

const CompareDocuments: React.FC<CompareDocumentsProps> = ({
  documentos,
  onSelectDocument,
  selectedDocuments,
  side,
}) => {
  return (
    <Flex direction="column" bg="white" borderRadius="md" p={4} boxShadow="md">
    
      {documentos.map((documento) => (
        <Flex key={documento.id_documento || 0} alignItems="center" mb={2}>
          <Checkbox
            colorScheme="blue" // Escolha um esquema de cores que combine com seu tema
            isChecked={selectedDocuments.has(documento.id_documento || 0)}
            onChange={() => onSelectDocument(documento.id_documento || 0)}
          >
            <Text ml={2} fontSize="md" fontWeight="medium">
              {documento.titulo}
            </Text>
          </Checkbox>
        </Flex>
      ))}
    </Flex>
  );
};

export default CompareDocuments;
