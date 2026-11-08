(() => {
  'use strict';

  const ART_PATH='assets/certificates/final-quest-certificate.png';
  const EXPORT_SCALE=2;
  const encoder=new TextEncoder();
  let artPromise=null;

  const ascii=(text)=>encoder.encode(text);
  const duration=(attempt)=>{
    const total=Number.isFinite(attempt.elapsedSeconds)?attempt.elapsedSeconds:Math.max(0,(Number(attempt.elapsedMinutes)||0)*60);
    return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(Math.floor(total%60)).padStart(2,'0')}`;
  };
  const dateFor=(attempt)=>new Date(attempt.endedAt).toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'});
  const safeName=(name)=>{
    const cleaned=String(name||'Student').normalize('NFKD').replace(/\p{M}/gu,'').trim().replace(/[^\p{L}\p{N}]+/gu,'_').replace(/^_+|_+$/g,'');
    return cleaned||'Student';
  };
  const filenameFor=(attempt,extension)=>`English_Quest_Lab_Unit0_${safeName(attempt.studentName)}.${extension}`;

  const loadArt=()=>{
    if(artPromise)return artPromise;
    artPromise=new Promise((resolve,reject)=>{
      const image=new Image();
      image.decoding='async';
      image.onload=()=>resolve(image);
      image.onerror=()=>reject(new Error('The certificate artwork could not be loaded.'));
      image.src=ART_PATH;
    });
    return artPromise;
  };

  const coverField=(context,field,topY,bottomY,canvasHeight)=>{
    const x=Math.round(field.x),y=Math.round(field.y),width=Math.round(field.width),height=Math.round(field.height);
    const top=context.getImageData(x,Math.round(canvasHeight*topY),width,1).data;
    const bottom=context.getImageData(x,Math.round(canvasHeight*bottomY),width,1).data;
    const patch=context.createImageData(width,height),data=patch.data;
    for(let row=0;row<height;row+=1){
      const mix=height===1?0:row/(height-1);
      for(let column=0;column<width;column+=1){
        const source=column*4,target=(row*width+column)*4;
        data[target]=Math.round(top[source]*(1-mix)+bottom[source]*mix);
        data[target+1]=Math.round(top[source+1]*(1-mix)+bottom[source+1]*mix);
        data[target+2]=Math.round(top[source+2]*(1-mix)+bottom[source+2]*mix);
        data[target+3]=255;
      }
    }
    context.putImageData(patch,x,y);
  };
  const drawFittedText=(context,text,box,{size,minimum=20,italic=false})=>{
    let fontSize=size;
    const font=()=>`${italic?'italic ':''}700 ${fontSize}px Georgia, "Times New Roman", serif`;
    context.font=font();
    while(fontSize>minimum&&context.measureText(text).width>box.width*.94){fontSize-=2;context.font=font();}
    context.fillStyle='#3a106e';
    context.textAlign='center';
    context.textBaseline='middle';
    context.fillText(text,box.x+box.width/2,box.y+box.height/2);
  };

  async function renderCertificate(attempt){
    const image=await loadArt();
    const canvas=document.createElement('canvas'),width=image.naturalWidth*EXPORT_SCALE,height=image.naturalHeight*EXPORT_SCALE;
    canvas.width=width;canvas.height=height;
    const context=canvas.getContext('2d',{alpha:false});
    context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
    context.drawImage(image,0,0,width,height);
    const box=(left,top,boxWidth,boxHeight)=>({x:width*left,y:height*top,width:width*boxWidth,height:height*boxHeight});
    const fields={
      name:box(.17,.354,.655,.054),score:box(.202,.591,.113,.0345),time:box(.487,.591,.115,.0345),
      date:box(.763,.591,.161,.0345),level:box(.394,.645,.375,.038)
    };
    coverField(context,fields.name,.348,.412,height);
    [fields.score,fields.time,fields.date].forEach(field=>coverField(context,field,.589,.626,height));
    coverField(context,fields.level,.646,.68,height);
    drawFittedText(context,String(attempt.studentName),fields.name,{size:width*.04,minimum:width*.023});
    drawFittedText(context,`${attempt.score}/100`,fields.score,{size:width*.0305,minimum:width*.021});
    drawFittedText(context,duration(attempt),fields.time,{size:width*.0305,minimum:width*.021});
    drawFittedText(context,dateFor(attempt),fields.date,{size:width*.0255,minimum:width*.019});
    drawFittedText(context,String(attempt.level),fields.level,{size:width*.028,minimum:width*.02,italic:true});
    return canvas;
  }

  const canvasBlob=(canvas,type,quality)=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('The certificate image could not be created.')),type,quality));
  const download=(blob,filename)=>{
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=filename;link.hidden=true;document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  };

  const makePdf=(jpeg,width,height)=>{
    const pageWidth=595.28,pageHeight=841.89,imageHeight=pageWidth*height/width,imageY=(pageHeight-imageHeight)/2;
    const content=`q\n1 0.973 0.933 rg\n0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)} re f\nQ\nq\n${pageWidth.toFixed(2)} 0 0 ${imageHeight.toFixed(2)} 0 ${imageY.toFixed(2)} cm\n/Im0 Do\nQ\n`;
    const objects=[
      ascii('<< /Type /Catalog /Pages 2 0 R >>'),
      ascii('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
      ascii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`),
      ascii(`<< /Length ${ascii(content).length} >>\nstream\n${content}endstream`),
      null
    ];
    const parts=[ascii('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')],offsets=[0];let length=parts[0].length;
    const append=(bytes)=>{parts.push(bytes);length+=bytes.length;};
    objects.forEach((body,index)=>{
      const id=index+1;offsets[id]=length;append(ascii(`${id} 0 obj\n`));
      if(id===5){append(ascii(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`));append(jpeg);append(ascii('\nendstream'));}
      else append(body);
      append(ascii('\nendobj\n'));
    });
    const xrefOffset=length;
    const xref=`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset=>`${String(offset).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    append(ascii(xref));
    return new Blob(parts,{type:'application/pdf'});
  };

  async function downloadPng(attempt){
    const canvas=await renderCertificate(attempt),blob=await canvasBlob(canvas,'image/png');
    download(blob,filenameFor(attempt,'png'));
  }
  async function downloadPdf(attempt){
    const canvas=await renderCertificate(attempt),jpegBlob=await canvasBlob(canvas,'image/jpeg',.98),jpeg=new Uint8Array(await jpegBlob.arrayBuffer());
    download(makePdf(jpeg,canvas.width,canvas.height),filenameFor(attempt,'pdf'));
  }

  window.CertificateExporter={downloadPng,downloadPdf,renderCertificate,filenameFor};
})();
