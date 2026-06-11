export const brazeJourneyDocumentation = `
Nombre del Canvas sugerido:
"New User Activation Journey - Minders Mall"

Evento de entrada:
account_created

Evento de conversión:
ecommerce.order_placed

Ventana de conversión:
7 días

Flujo sugerido:
1. Entrada por cuenta creada.
2. Mensaje de bienvenida.
3. Esperar interacción.
4. Action Path:
   - Si ve producto: enviar recomendación personalizada.
   - Si agrega al carrito: enviar incentivo de checkout.
   - Si compra: enviar agradecimiento y cross sell.
   - Si no hace nada: enviar recordatorio de exploración.
5. Audience Path:
   - Premium interest = true: mostrar productos premium.
   - Belleza o skincare: mostrar productos de cuidado personal.
   - Moda: mostrar prendas destacadas.
   - Activewear: mostrar productos de movimiento.
6. Salida si realiza compra.
7. Salida si se da de baja o no cumple condiciones.
`;
