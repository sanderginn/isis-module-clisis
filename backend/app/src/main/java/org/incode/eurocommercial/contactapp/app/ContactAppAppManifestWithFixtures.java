/*
 *  Copyright 2015-2016 Eurocommercial Properties NV
 *
 *  Licensed under the Apache License, Version 2.0 (the
 *  "License"); you may not use this file except in compliance
 *  with the License.  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */
package org.incode.eurocommercial.contactapp.app;

import java.util.List;
import java.util.Map;

import com.google.common.collect.Lists;

import org.apache.isis.applib.fixturescripts.FixtureScript;

import org.incode.eurocommercial.contactapp.fixture.scenarios.demo.DemoFixture;

public class ContactAppAppManifestWithFixtures extends ContactAppAppManifest {

    /**
     * Fixtures to be installed.
     */
    @Override
    public List<Class<? extends FixtureScript>> getFixtures() {
        return Lists.newArrayList(DemoFixture.class);
    }

    /**
     * Force fixtures to be loaded.
     */
    @Override
    protected void appendConfigurationProperties(final Map<String, String> props) {
        super.appendConfigurationProperties(props);
        props.put("isis.persistor.datanucleus.install-fixtures","true");
    }
}
