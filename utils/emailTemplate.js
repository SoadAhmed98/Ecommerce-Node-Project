export default function emailTemp(url,notice,email,name){
    return `<!-- See the settings for some head CSS styles -->
    <table class="email" 
           width="100%"
           border="0"
           cellspacing="0"
           cellpadding="20" 
           style="border-bottom-width: 10px;
                  border-bottom-style: solid;
                  border-bottom-color: #ff665e">
      
      <tr>
        <td class="header" 
           style="background-color: #ff665e; text-align: center;">
          
          <table border="0" 
                 style="color: #fff; 
                        width: 600px; 
                        margin: 0 auto; 
                        font-family: Arial, Helvetica, sans-serif;" 
                cellspacing="0"  width="600">
            <tr>
              <td colspan="2">
                <h1 style="margin: auto; display: block; text-align: center;">Account verification</h1>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
      <tr>
        <td class="content" 
           style="background-color: #eee; text-align: center;">
          
          <table border="0" 
                 style="color: #444; 
                        width: 600px; 
                        margin: 0 auto; 
                        border-bottom-width: 1px;
                        border-bottom-style: solid;
                        border-bottom-color: #ddd;
                        font-family: Arial, Helvetica, sans-serif;
                        line-height: 1.4;" 
                 cellpadding="15" cellspacing="1"  width="600">
               
            <!-- Content rows here -->
            <tr  style="background-color:#fff">
              <td width="30%"><strong>Name:</strong></td>
              <td>${name}</td>
            </tr>
            <tr  style="background-color:#fff">
              <td width="30%"><strong>Email:</strong></td>
              <td>${email}</td>
            </tr>
            <tr  style="background-color:#fff">
              <td width="30%"><strong>Subject:</strong></td>
              <td>${notice}</td>
            </tr>
            <tr  style="background-color:#fff">
            <td align="center" style="border-radius: 3px;" bgcolor="#ffffff"  colspan="2">
              <a href=${url} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ff665e; text-decoration: none; padding: 11px 22px; border-radius: 2px; border: 1px solid #ff665e; display: inline-block; text-align:center;">Verify</a>
            </td>
          </tr>
          </table>
          
         
        </td>
      </tr>
    </table>
    `;
}