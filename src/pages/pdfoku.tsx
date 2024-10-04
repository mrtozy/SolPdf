import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PdfOku: NextPage = () => {
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query; 

  useEffect(() => {
    if (id) {
      const path = localStorage.getItem(`pdfPath_${id}`); 
      if (path) {
        setPdfPath(path);
      }
    }
  }, [id]);

  return (
    <div>
      <Head>
        <title>PDF Oku</title>
      </Head>
      
      {pdfPath ? (
       <iframe
       src={pdfPath}
       style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "50vh", border: "none" }}
       frameBorder="0"
     ></iframe>
      ) : (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <h2>PDF Erişimi İçin Giriş Yapmalısınız</h2>
          <p>PDF'yi görüntülemek için geçerli bir oturum açmalısınız.</p>
        </div>
      )}
    </div>
  );
};

export default PdfOku;
