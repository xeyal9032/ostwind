import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { session, user, error } = await requireSession();
    if (error) return error;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Benzersiz dosya adı oluştur
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Dosya adındaki boşlukları tire ile değiştir ve güvenli hale getir
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const filename = `${uniqueSuffix}-${sanitizedName}`;
    
    // public/uploads klasörünün var olduğundan emin ol
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Dosyayı kaydet
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Açık URL'i döndür
    const fileUrl = `/uploads/${filename}`;

    await prisma.mediaFile.create({
      data: {
        filename: sanitizedName,
        path: fileUrl,
        mimeType: file.type || null,
        sizeBytes: buffer.length,
        uploadedById: user?.id,
      },
    });

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Dosya yüklenirken bir hata oluştu' }, { status: 500 });
  }
}
