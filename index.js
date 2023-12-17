const http =require('http');
const fs=require('fs');
const url=require('url');

const replaceTemaplate=(temp,product)=>{
   let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
   output=output.replace(/{%IMAGE%}/g,product.image);
   output=output.replace(/{%DESCRIPTION%}/g,product.description);
   output=output.replace(/{%PRICE%}/g,product.price);
   output=output.replace(/{%FROM%}/g,product.from);
   output=output.replace(/{%QUANTITY%}/g,product.quantity);
   output=output.replace(/{%ID%}/g,product.id);
   output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);

   if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
   return output;
}

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

const server=http.createServer((req,res)=>{
      const{query,pathname}=url.parse(req.url,true);
      
      if(pathname === '/' || pathname === '/overview'){
        const cardsHtml=dataObj.map(el=>replaceTemaplate(tempCard,el)).join('');
        res.writeHead(200,{'content-type':'text/html'});
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);


      }else if(pathname === '/product'){
        const product=dataObj[query.id];
        let output=replaceTemaplate(tempProduct,product);
        res.end(output);


      }else if (pathname === '/contact'){
        res.end("this is an contact page")


      }else if(pathname === '/Api') {
        res.writeHead(200,{'content-type':'application/json'});
        res.end(data);

      }else{
        res.writeHead(404,{'content-type':'text/html'});
        res.end("<h1>pade is not found</h1>");
      }

});

server.listen(8000,'127.0.0.1',()=>{
    console.log("server running to the port 8000")
});