import React, { useState } from 'react';
import axios from 'axios';

const YandexDiskUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [accessToken, setAccessToken] = useState('')
    const handleFileInputChange = (event) => {
        const files = event.target.files;
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const getURLForUpload = async (file) => {
        try {
            const response = await axios.get(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/${file.name}`, {
                headers: {
                    Authorization: `OAuth ${accessToken}`,
                }
            })
            await uploadFileToYandexDisk(file, response.data.href)
        } catch (e) {
            console.error(e)
        }
    }

    const uploadFileToYandexDisk = async (file, url) => {
        try {
            setIsUploading(true);

            const response = await axios.put(url, file)

            if (response.status === 201) {
                setIsUploading(false);
            }
        } catch (error) {
            setIsUploading(false);
            console.error('Ошибка:', error);
            alert('Произошла ошибка при загрузке файла на Яндекс.Диск.');
        }
    };

    const handleUploadFiles = () => {
        if (selectedFiles.length === 0) {
            alert('Выберите файлы для загрузки.');
            return;
        }

        if (selectedFiles.length > 100) {
            alert('Выберите меньше 100 файлов для загрузки');
            selectedFiles.length = 0;
            return;
        }

        selectedFiles.forEach(file =>
            getURLForUpload(file)
        );
        setSelectedFiles([]); // Очистка выбранных файлов после загрузки
    };

    return (
        <div>
            <h1>Загрузка файлов на Яндекс.Диск</h1>
            <div>
                <h3>Вставьте ваш токен</h3>
                <input type={'password'} onChange={(e) => setAccessToken(e.target.value)} style={{marginBottom: '20px'}}/>
            </div>
            <input type="file" multiple onChange={handleFileInputChange} />
            <button onClick={handleUploadFiles} disabled={isUploading}>
                {isUploading ? 'Загрузка...' : 'Загрузить'}
            </button>
            {selectedFiles.length > 0 && (
                <div>
                    <h2>Выбранные файлы:</h2>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default YandexDiskUploader;
