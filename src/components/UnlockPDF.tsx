import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";
import router from 'next/router';

const pdfs = [
    { id: 'standart_programlama', name: 'Standart Programlama Yapilari', path: '/assets/pdfs/Standart_Programlama_Yapilari.pdf', price: 1_000_000 },
    { id: 'degiskenler_ve_veri_tipleri', name: 'Degiskenler ve Veri Tipleri', path: '/assets/pdfs/Degiskenler_ve_Veri_Tipleri.pdf', price: 2_000_000 },
    { id: 'java_giris', name: 'Java Giris', path: '/assets/pdfs/Java_Giris.pdf', price: 3_000_000 },
];

export const UnlockPDF: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);

    const handlePDFUnlock = useCallback(async (pdfId: string, pdfName: string, amountInLamports: number) => {
        if (!publicKey) {
            notify({ type: 'error', message: `Cüzdan bağlantısı sağlanmadı!` });
            return;
        }

        const accessKey = localStorage.getItem(`pdfAccess_${pdfId}`);
        if (accessKey) {
            router.push(`/pdfoku?id=${pdfId}`); 
            return;
        }

        let signature: TransactionSignature = '';
        setLoading(true);

        try {
            const recipientPublicKey = new Keypair().publicKey;

            const instructions = [
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPublicKey,
                    lamports: amountInLamports,
                }),
            ];

            const latestBlockhash = await connection.getLatestBlockhash();

            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: latestBlockhash.blockhash,
                instructions,
            }).compileToV0Message();

            const transaction = new VersionedTransaction(messageV0);
            signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            notify({ type: 'success', message: 'İşlem başarılı!', txid: signature });

            if (signature) {
                localStorage.setItem(`pdfAccess_${pdfId}`, signature);
                localStorage.setItem(`pdfPath_${pdfId}`, pdfs.find(pdf => pdf.id === pdfId)?.path);
                router.push(`/pdfoku?id=${pdfId}`); 
            }

        } catch (error: any) {
            notify({ type: 'error', message: `İşlem başarısız!`, description: error?.message, txid: signature });
        } finally {
            setLoading(false);
        }
    }, [publicKey, notify, connection, sendTransaction]);

    return (
        <div className="flex flex-row justify-center">
            {pdfs.map(pdf => {
                const hasAccess = localStorage.getItem(`pdfAccess_${pdf.id}`);

                return (
                    <div className="relative group items-center" key={pdf.id}>
                        <button
                            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                            onClick={() => hasAccess ? router.push(`/pdfoku?id=${pdf.id}`) : handlePDFUnlock(pdf.id, pdf.name, pdf.price)} 
                            disabled={!publicKey || loading}
                        >
                            {loading ? 'Yükleniyor...' : hasAccess ? 'PDF İncele' : `${pdf.name} için ${pdf.price / 1_000_000} SOL Ödeme Yap`}
                            <div className="hidden group-disabled:block ">
                                Cüzdan bağlı değil
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
