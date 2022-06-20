// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: EUPL-1.2

import Head from "next/head";
import PageContainer from "~/components/layout/PageContainer";
import DefaultLayout from "~/components/layout/DefaultLayout";
import PageTitle from "~/components/layout/PageTitle";

export default function Imprint() {
    return (
        <DefaultLayout>
            <Head>Imprint</Head>
            <PageTitle title="Imprint"/>
            <PageContainer>
                <p className="py-1">Imprint according to § 5 TMG (Tele Media Act) and § 55 RStV (German Interstate Treaty on Broadcasting).</p>
                <section className="py-2">
                    <h2>Provider</h2>
                    <p className="py-1">The provider of the internet presence helmholtz.software is the Helmholtz Centre Potsdam German Research Centre for Geosciences.</p>
                    <p className="py-1">This internet presence was developed within the HIFIS incubator of the Helmholtz Association of German Research Centres.</p>
                </section>
                <section className="py-2">
                <h2>Address</h2>
                    <div>
                        Helmholtz Centre Potsdam German Research Centre for Geosciences - GFZ<br/>
                        Telegrafenberg<br/>
                        14473 Potsdam, Germany<br/>
                        Tel.: +49 331 288 0<br/>
                        Website: <a href="https://www.gfz-potsdam.de" target="_blank">www.gfz-potsdam.de</a><br/>
                    </div>
                </section>
                <section className="py-2">
                    <h2>Legal form</h2>
                    <p className="py-1">The Helmholtz Centre Potsdam German Research Centre for Geosciences - GFZ is a Public Law Foundation. The GFZ is member of the <a href="https://www.helmholtz.de/" target="_blank">Helmholtz-Gemeinschaft Deutscher Forschungszentren e.V. (Helmholtz Association of German Research Centres)</a>.</p>
                </section>
                <section className="py-2">
                    <h2>Authorised representatives</h2>
                    <p className="py-1">The GFZ is legally represented by Prof. Dr. Susanne Buiter (Chairwoman of the Board and Scientific Executive Director, interim) and Dr. Stefan Schwartze (Administrative Executive Director).</p>
                </section>
                <section className="py-2">
                    <h2>Value added tax ID</h2>
                    <p className="py-1">Umsatzsteuer-Identifikationsnummer gemäß § 27a UstG: DE138407750</p>
                </section>
                <section className="py-2">
                    <h2>Editorial staff</h2>
                    <div className="py-1">
                        Responsible editor for the contents of this internet presence with regard to media law is:<br/>
                        Martin Hammitzsch (Head of eScience-Centre)<br/>
                        Tel.: +49 331 288-1717<br/>
                        E-Mail: martin.hammitzsch@gfz-potsdam.de<br/>
                    </div>
                    <div className="py-1">
                        Editor, concept, coordination (helmholtz.software)<br/>
                        Dr. Christian Meeßen<br/>
                        Tel.: +49 331 288-1983<br/>
                        E-Mail: christian.meessen@gfz-potsdam.de<br/>
                    </div>
                </section>
                <section className="py-2">
                    <h2>Copyright</h2>
                    <p className="py-1">The texts and images on this website are protected by copyright. Copying these files or printing the publications is only permitted for private use.</p>
                    <p className="py-1">All other uses, such as duplication, alteration or use of these graphics, recordings, video sequences or texts on this websites in further electronic or printed publications for non-commercial and commercial purposes are not permitted without the explicit consent of the copyright holder - even if they are not labelled as a copyright protected document.</p>
                    <p className="py-1">Content, which is published under the Creative Commons License may be used only in accordance with the specified license conditions.</p>
                    <p className="py-1">Certain data products on this portal originate from other sources. If you would like to make use of these data, please contact the data owner concering licenseing terms or see terms of use on the corresponding web pages.</p>
                </section>
                <section className="py-2">
                    <h2>Liability notice</h2>
                    <p className="py-1">The editorial staff controls and updates the available information on this website at regular intervals. Despite all care, information, data or links may have changed in the meantime. There is no liability or guarantee for the currentness, accuracy and completeness of the information provided.</p>
                    <p className="py-1">The same applies to all other websites, which are referred to by hyperlink. There is not responsibility for the content of the websites that are reached as a result of such a connection. Instead the relevant provider is always responsible for the contents of the linked pages.</p>
                    <p className="py-1">In establishing the initial link, the editorial staff has reviewed the relevant external content in order to determine that they were free of illegal content at the time of linking.</p>
                    <p className="py-1">If you detect errors in content or technology, please let us know.</p>
                </section>
            </PageContainer>
        </DefaultLayout>
    )
}