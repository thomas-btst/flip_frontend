export function ContactPage() {
    return <>
        <section className="pb-16 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Contactez-nous</h2>
                    <p className="mt-4 text-lg text-gray-700">Vous avez une question ou besoin d&apos;aide ? N&apos;hésitez pas à nous contacter !</p>
                </div>
                
                <div className="lg:w-1/2 mt-12 lg:mt-0 text-center mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Nos Informations</h3>
                    <p className="text-lg text-gray-700 mb-4">
                        <strong>Adresse :</strong> <a target="_blank" href="https://maps.app.goo.gl/1hJo4bHsBVCkFZXg9" className="hover:underline text-red-700" rel="noreferrer">123 Rue du Skate, 13000 Marseille, France</a>
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        <strong>Téléphone :</strong> <a className="hover:underline text-red-700" href="tel:0909090909">0909090909</a>
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                        <strong>Email :</strong> <a className="hover:underline text-red-700" href= "mailto:flip.skateshop.noreply@gmail.com">flip.skateshop.noreply@gmail.com</a>
                    </p>

                    <div className="mt-8">
                        <h4 className="text-xl font-semibold text-gray-900">Où nous trouver</h4>
                        <div className="mt-4 w-full h-80">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.298131830701!2d2.293676515674596!3d48.85884497928798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671ed2ac4ef4f%3A0x4315920d8b2803a0!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1609238876002!5m2!1sen!2sfr" width="100%" height="100%" className="rounded-sm"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}